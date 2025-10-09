"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreditCard, Smartphone, CheckCircle, Loader2Icon } from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, course, onSuccess }) {
  const [selectedMethod, setSelectedMethod] = useState('evc');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [evcCode, setEvcCode] = useState('');
  const [edahabCode, setEdahabCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Select method, 2: Enter details, 3: Confirm

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would:
      // 1. Send payment details to your backend
      // 2. Process payment with EVC/E-dahab API
      // 3. Handle success/failure responses
      
      console.log('Payment details:', {
        method: selectedMethod,
        phoneNumber,
        evcCode,
        edahabCode,
        courseId: course.id,
        amount: course.price
      });
      
      setStep(3);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setPhoneNumber('');
    setEvcCode('');
    setEdahabCode('');
    setLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">{course.name}</h3>
              <p className="text-2xl font-bold text-green-600">${course.price}</p>
            </div>

            <Tabs value={selectedMethod} onValueChange={setSelectedMethod}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="evc">EVC Plus</TabsTrigger>
                <TabsTrigger value="edahab">E-dahab</TabsTrigger>
              </TabsList>

              <TabsContent value="evc" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <Smartphone className="w-5 h-5 mr-2 text-blue-600" />
                      EVC Plus Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Phone Number
                      </label>
                      <Input
                        placeholder="+252 61 234 5678"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        EVC Code
                      </label>
                      <Input
                        placeholder="Enter your EVC code"
                        value={evcCode}
                        onChange={(e) => setEvcCode(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      You will receive a confirmation SMS on your phone.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="edahab" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                      E-dahab Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Phone Number
                      </label>
                      <Input
                        placeholder="+252 61 234 5678"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        E-dahab Code
                      </label>
                      <Input
                        placeholder="Enter your E-dahab code"
                        value={edahabCode}
                        onChange={(e) => setEdahabCode(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      You will receive a confirmation SMS on your phone.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={() => setStep(2)}
                disabled={!phoneNumber || (selectedMethod === 'evc' && !evcCode) || (selectedMethod === 'edahab' && !edahabCode)}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Confirm Payment</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Course: {course.name}</p>
                <p className="text-lg font-semibold">Amount: ${course.price}</p>
                <p className="text-sm text-gray-600">
                  Method: {selectedMethod === 'evc' ? 'EVC Plus' : 'E-dahab'}
                </p>
                <p className="text-sm text-gray-600">Phone: {phoneNumber}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handlePayment}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Pay Now
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-600">Payment Successful!</h3>
            <p className="text-gray-600">
              You have been enrolled in the course. You can now start learning!
            </p>
            <Button onClick={handleClose} className="w-full">
              Start Learning
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
